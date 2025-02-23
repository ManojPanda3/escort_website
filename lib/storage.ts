"use client";

export async function uploadToStorage(file: File, userId: string) {
  try {
    if (!file) {
      throw new Error("No file provided."); // Check for missing file
    }

    if (!userId) {
      throw new Error("User ID is required."); //check for userId
    }

    const timestamp = Date.now(); // Use Date.now() directly
    const fileName = `user/${userId}/${timestamp}-${file.name}`; // Consistent naming with server.  Good!

    // No need to convert to base64, fetch can handle the File object directly
    const signedUrlRes = await fetch("/api/storage/singedUrl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        fileName,  // Send the *full*, constructed filename
        fileType: file.type,
      }),
    });

    if (!signedUrlRes.ok) {
      const errorData = await signedUrlRes.json();
      throw new Error(`Failed to get signed URL: ${errorData.error || 'Unknown error'}`);
    }

    const { url, publicUrl } = await signedUrlRes.json();


    const uploadRes = await fetch(url, {
      method: "PUT",
      body: file, // Send the File object directly
      headers: { // No Content-Type header needed when using a presigned URL, the server knows
        // "Content-Type": file.type, // Removed, not necessary with presigned URLs
      },
    });

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json(); //attempt to read response
      throw new Error(`Failed to upload file: ${errorData.error || 'Unknown error with status ' + uploadRes.status}`);
    }

    // No need to append filename again, publicUrl is already complete
    return { success: true, fileUrl: publicUrl, userId, error: '' };

  } catch (error: any) {
    console.error("Error in uploadToStorage:", error); // Log the error
    return { success: false, fileUrl: "", userId, error: error.message || "An unknown error occurred" };
  }
}

export async function deleteFromStorage(fileUrl: string, userId: string) {
  try {
    if (!fileUrl) {
      throw new Error("File URL is required.");
    }

    if (!userId) {
      throw new Error("User ID is required.");
    }
    const fileName = fileUrl.split("/").pop(); // gets the file name
    if (!fileName) {
      throw new Error("Invalid file URL");
    }

    const res = await fetch("/api/storage/singedUrl", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, userId }), //Keep sending userId
    });

    if (!res.ok) {
      const errorData = await res.json(); // Get error details.
      throw new Error(`Failed to delete file: ${errorData.error || 'Unknown error with status ' + res.status}`);
    }

    return { success: true, error: '' }; // Include error in success case too

  } catch (error: any) {
    console.error("Error in deleteFromStorage:", error); // Log the error
    return { success: false, error: error.message || "An unknown error occurred" };
  }
}
