function sortImageURLsBySize() {
  return new Promise((resolve, reject) => {
    // Get all images on the page
    const images = [...document.images];

    // Create an array of promises to get image dimensions
    const imagePromises = images.map(img => 
      new Promise((resolve) => {
        if (img.complete) {
          resolve({ img, size: img.naturalWidth * img.naturalHeight });
        } else {
          img.onload = () => resolve({ img, size: img.naturalWidth * img.naturalHeight });
          img.onerror = () => resolve({ img, size: 0 });
        }
      })
    );

    // Wait for all images to load and get their sizes
    Promise.all(imagePromises)
      .then(imageSizes => {
        // Sort images by size (largest to smallest)
        const sortedImages = imageSizes.sort((a, b) => b.size - a.size);

        // Extract URLs of sorted images
        const sortedURLs = sortedImages.map(item => item.img.src);

        // Log the result
        console.log('Images sorted by size (largest to smallest):', sortedImages);
        
        // Resolve the promise with the sorted URLs
        resolve(sortedURLs);
      })
      .catch(reject);
  });
}

// Run the function and handle the result
sortImageURLsBySize()
  .then(urls => {
    console.log('Sorted image URLs:', urls);
    console.log('To copy URLs to clipboard, run: copy(urls.join("\\n"))');
    // Make urls globally accessible
    window.sortedImageUrls = urls;
    console.log('URLs are now available in the global variable "sortedImageUrls"');
  })
  .catch(err => {
    console.error('An error occurred:', err);
  });
