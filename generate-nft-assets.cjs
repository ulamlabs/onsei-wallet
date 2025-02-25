const fs = require("fs");
const https = require("https");
const path = require("path");

// Create directories if they don't exist
const imagesDir = path.join("nft-assets");

fs.mkdirSync(imagesDir, { recursive: true });

// Function to download an image
function downloadImage(id) {
  return new Promise((resolve, reject) => {
    const url = `https://picsum.photos/300/300?random=${id}`;
    const filePath = path.join(imagesDir, `${id}.png`);
    console.log("url", url);

    https
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 302 || response.statusCode === 301) {
          https
            .get(response.headers.location, (finalResponse) => {
              const fileStream = fs.createWriteStream(filePath);
              finalResponse.pipe(fileStream);

              fileStream.on("finish", () => {
                fileStream.close();
                console.log(`Downloaded image ${id}`);
                resolve();
              });

              fileStream.on("error", (err) => {
                fs.unlink(filePath, () => reject(err));
              });
            })
            .on("error", (err) => reject(err));
        } else if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filePath);
          response.pipe(fileStream);

          fileStream.on("finish", () => {
            fileStream.close();
            console.log(`Downloaded image ${id}`);
            resolve();
          });

          fileStream.on("error", (err) => {
            fs.unlink(filePath, () => reject(err));
          });
        } else {
          reject(new Error(`HTTP Status ${response.statusCode}`));
        }
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Function to create metadata
function createMetadata(id) {
  const metadata = {
    name: `NFT #${id}`,
    description: `A unique NFT #${id}`,
    image: "ipfs://<CID>/" + `${id}.png`, // CID will be added later
    attributes: {
      Background: "Generated",
      ID: id.toString(),
    },
  };

  const filePath = path.join(imagesDir, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
  console.log(`Created metadata for ${id}`);
}

// Main function to download images and create metadata
async function generateNFTAssets(count = 20) {
  console.log("Starting NFT asset generation...");

  for (let i = 1; i <= count; i++) {
    try {
      await downloadImage(i);
      createMetadata(i);
    } catch (error) {
      console.error(`Error processing NFT #${i}:`, error);
    }
  }

  console.log("NFT asset generation complete!");
}

// Run the script
generateNFTAssets();
