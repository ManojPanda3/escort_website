'use client'

export async function uploadToStorage(file: File, userId: string) {
  try {
    const timestamp = new Date().getTime();
    const fileName = `${userId}-${timestamp}-${file.name}`;

    // Read file content as base64
    const fileContent = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Content = reader.result as string;
        // Remove data URL prefix to get just the base64 content
        const base64Data = base64Content.split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(file);
    });

    const signedUrlRes = await fetch('/api/storage/singedUrl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        fileName,
        fileType: file.type,
      }),
    });

    if (!signedUrlRes.ok) {
      throw new Error('Failed to get signed URL');
    }

    const data = await signedUrlRes.json();
    const { url, publicUrl } = data;

    // Convert base64 back to binary
    const binaryData = Buffer.from(fileContent, 'base64');

    const uploadRes = await fetch(url, {
      method: 'PUT',
      body: binaryData,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadRes.ok) {
      throw new Error('Failed to upload file');
    }
    const fileUrl = publicUrl + "/" + fileName

    // Return the public URL where the file can be accessed
    return {
      success: true,
      fileUrl,
      userId
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

export async function deleteFromStorage(fileUrl: string, userId: string) {
  try {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) {
      throw new Error('Invalid file URL');
    }

    const res = await fetch('/api/storage/singedUrl', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, userId }),
    });

    if (!res.ok) {
      throw new Error('Failed to delete file');
    }

    const { url } = await res.json();

    const deleteRes = await fetch(url, {
      method: 'DELETE',
    });

    if (!deleteRes.ok) {
      throw new Error('Failed to execute delete');
    }

    return {
      success: true
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
