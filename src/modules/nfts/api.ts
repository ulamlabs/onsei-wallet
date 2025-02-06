import { useQuery } from "@tanstack/react-query";

export type NFT = {
  id: number;
  name: string;
  image: string;
  collection: string;
  description: string;
};

const mockNFTs: NFT[] = [
  {
    id: 1,
    name: "Bored Ape #1234",
    image: "https://picsum.photos/300/300?random=1",
    collection: "Bored Ape Yacht Club",
    description: "A unique digital collectible from the BAYC collection",
  },
  {
    id: 2,
    name: "Crypto Punk #5678",
    image: "https://picsum.photos/300/300?random=2",
    collection: "CryptoPunks",
    description: "One of 10,000 unique collectible characters",
  },
  {
    id: 3,
    name: "Doodle #910",
    image: "https://picsum.photos/300/300?random=3",
    collection: "Doodles",
    description: "A joyful collection of doodles",
  },
  {
    id: 4,
    name: "Azuki #1112",
    image: "https://picsum.photos/300/300?random=4",
    collection: "Azuki",
    description: "Enter the garden. A new kind of brand.",
  },
  {
    id: 5,
    name: "Clone X #1314",
    image: "https://picsum.photos/300/300?random=5",
    collection: "Clone X",
    description: "The next generation of digital identity",
  },
  {
    id: 6,
    name: "Bored Ape #7777",
    image: "https://picsum.photos/300/300?random=6",
    collection: "Bored Ape Yacht Club",
    description: "A rare golden fur BAYC with laser eyes and crown",
  },
  {
    id: 7,
    name: "Bored Ape #8888",
    image: "https://picsum.photos/300/300?random=7",
    collection: "Bored Ape Yacht Club",
    description: "A zombie BAYC wearing a leather jacket and chain",
  },
  {
    id: 8,
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
  console.log("getNFTs", address);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const shouldError = Math.random() > 0.5;
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
