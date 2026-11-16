// Shrinks a photo in the browser before upload 
// Keeps uploads small and fast, and under the 4.5 MB request limit of serverless hosting.
export const compressImage = (file: File, maxSize = 1280, quality = 0.82): Promise<File> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext("2d")
      if (!ctx) return resolve(file)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) return resolve(file) // already small
          const name = file.name.replace(/\.[^.]+$/, "") + ".jpg"
          resolve(new File([blob], name, { type: "image/jpeg" }))
        },
        "image/jpeg",
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file) // could not read it; upload the original
    }
    img.src = url
  })