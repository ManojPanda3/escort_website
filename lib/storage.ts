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
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json();
      throw new Error(`Failed to upload file: ${errorData.error || 'Unknown error with status ' + uploadRes.status}`);
    }

    return { success: true, fileUrl: publicUrl, userId, error: '' };

  } catch (error: any) {
    console.error("Error in uploadToStorage:", error);
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
    const fileName = extractKeyFromUrl(fileUrl, process.env.NEXT_PUBLIC_R2_PUBLIC_URL);
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

function extractKeyFromUrl(url: string, publicBucketName: string) {
  const urlParts = new URL(url);
  const publicBucketLen = publicBucketName.length
  if (urlParts.pathname.length < publicBucketLen && urlParts.pathname.slice(0, publicBucketLen) !== publicBucketName) {
    throw new Error(`URL does not match the bucket name: ${url}`);
    return;
  }
  const pathParts = urlParts.pathname.slice(publicBucketLen);
  return pathParts
}
