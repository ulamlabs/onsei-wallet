import { useQuery } from "@tanstack/react-query";

export type NFT = {
  id: string;
  name: string;
  image: string;
  collection: string;
  description: string;
  attributes?: {
    Background?: string;
    Body?: string;
    Mouth?: string;
    Headwear?: string;
    Eyes?: string;
    Clothing?: string;
    Accessories?: string;
  };
};

const mockNFTs: NFT[] = [
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n4",
    name: "So Cub #3084",
    image: "https://picsum.photos/300/300?random=1",
    collection: "So Cubs",
    description: "3,333 Carefree Cubs spreading love on the Sei Network.",
    attributes: {
      Background: "Bubbles",
      Body: "Doodle",
      Mouth: "Dafodil",
      Headwear: "None",
      Eyes: "Tear Drop",
      Clothing: "Tattoos",
      Accessories: "None",
    },
  },
  {
    id: "sei1h2dj405zvhr6vz5c9vj0qr7x2v7mcxh8r5n2",
    name: "So Cub #2156",
    image: "https://picsum.photos/300/300?random=2",
    collection: "So Cubs",
    description: "3,333 Carefree Cubs spreading love on the Sei Network.",
    attributes: {
      Background: "Stars",
      Body: "Classic",
      Mouth: "Happy",
      Eyes: "Sleepy",
      Clothing: "Hoodie",
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n5",
    name: "So Cub #910",
    image: "https://picsum.photos/300/300?random=3",
    collection: "So Cubs",
    description: "3,333 Carefree Cubs spreading love on the Sei Network.",
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n6",
    name: "So Cub #4442",
    image: "https://picsum.photos/300/300?random=4",
    collection: "So Cubs",
    description: "3,333 Carefree Cubs spreading love on the Sei Network.",
    attributes: {
      Background: "Rainbow",
      Body: "Golden",
      Mouth: "Smile",
      Headwear: "Crown",
      Eyes: "Diamond",
      Clothing: "Suit",
      Accessories: "Gold Chain",
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n7",
    name: "Bored Ape #1234",
    image: "https://picsum.photos/300/300?random=1",
    collection: "Bored Ape Yacht Club",
    description: "A unique digital collectible from the BAYC collection",
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n8",
    name: "Crypto Punk #5678",
    image: "https://picsum.photos/300/300?random=2",
    collection: "CryptoPunks",
    description: "One of 10,000 unique collectible characters",
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n9",
    name: "Doodle #910",
    image: "https://picsum.photos/300/300?random=3",
    collection: "Doodles",
    description: "A joyful collection of doodles",
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6na",
    name: "Azuki #1112",
    image: "https://picsum.photos/300/300?random=4",
    collection: "Azuki",
    description: "Enter the garden. A new kind of brand.",
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6nb",
    name: "Clone X #1314",
    image: "https://picsum.photos/300/300?random=5",
    collection: "Clone X",
    description: "The next generation of digital identity",
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6nc",
    name: "Bored Ape #7777",
    image: "https://picsum.photos/300/300?random=6",
    collection: "Bored Ape Yacht Club",
    description: "A rare golden fur BAYC with laser eyes and crown",
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6nd",
    name: "Bored Ape #8888",
    image: "https://picsum.photos/300/300?random=7",
    collection: "Bored Ape Yacht Club",
    description: "A zombie BAYC wearing a leather jacket and chain",
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6ne",
    name: "Bored Ape #9999",
    image: "https://picsum.photos/300/300?random=8",
    collection: "Bored Ape Yacht Club",
    description: "A rainbow fur BAYC with 3D glasses and party hat",
  },
];

export async function getNFTs(address: string | undefined) {
  if (!address) {
    return [];
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const shouldError = Math.random() > 1;
  if (shouldError) {
    throw new Error("Failed to fetch NFTs");
  }
  return mockNFTs;
}

export function useNFTs(address: string | undefined) {
  return useQuery({
    queryKey: ["nfts", address],
    queryFn: () => getNFTs(address),
    enabled: !!address,
    staleTime: 0,
    // staleTime: 1000 * 60 * 60, // 1 hour
  });
}
