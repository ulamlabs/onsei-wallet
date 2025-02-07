import { useQuery } from "@tanstack/react-query";

export type OwnershipRecord = {
  address: string;
  timestamp: string;
  transactionHash: string;
};

export type CreatorProfile = {
  name: string;
  description?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  collections?: string[];
  totalNFTs?: number;
};

export type NFT = {
  id: string;
  name: string;
  image: string;
  collection: string;
  description: string;
  creator?: CreatorProfile;
  attributes?: Record<string, string>;
  ownershipHistory?: OwnershipRecord[];
};

const mockNFTs: NFT[] = [
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n4",
    name: "So Cub #3084",
    image: "https://picsum.photos/300/300?random=1",
    collection: "So Cubs",
    description: "3,333 Carefree Cubs spreading love on the Sei Network.",
    creator: {
      name: "SoCubs Team",
      description:
        "Creating cute and carefree cubs on the Sei Network. Our mission is to spread joy through digital art.",
      avatar: "https://picsum.photos/200/200?random=creator1",
      website: "https://socubs.io",
      twitter: "@SoCubsNFT",
      collections: ["So Cubs", "So Bears"],
      totalNFTs: 3333,
    },
    attributes: {
      Background: "Bubbles",
      Body: "Doodle",
      Mouth: "Dafodil",
      Headwear: "None",
      Eyes: "Tear Drop",
      Clothing: "Tattoos",
      Accessories: "None",
    },
    ownershipHistory: [
      {
        address: "sei1current0owner000address0000000000000",
        timestamp: "2024-03-15T10:30:00Z",
        transactionHash: "0xabc123...",
      },
      {
        address: "sei1previous0owner00address0000000000000",
        timestamp: "2024-02-20T15:45:00Z",
        transactionHash: "0xdef456...",
      },
    ],
  },
  {
    id: "sei1h2dj405zvhr6vz5c9vj0qr7x2v7mcxh8r5n2",
    name: "So Cub #2156",
    image: "https://picsum.photos/300/300?random=2",
    collection: "So Cubs",
    description: "3,333 Carefree Cubs spreading love on the Sei Network.",
    creator: {
      name: "SoCubs Team",
      description:
        "Creating cute and carefree cubs on the Sei Network. Our mission is to spread joy through digital art.",
      avatar: "https://picsum.photos/200/200?random=creator1",
      website: "https://socubs.io",
      twitter: "@SoCubsNFT",
      collections: ["So Cubs", "So Bears"],
      totalNFTs: 3333,
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n5",
    name: "So Cub #910",
    image: "https://picsum.photos/300/300?random=3",
    collection: "So Cubs",
    description: "3,333 Carefree Cubs spreading love on the Sei Network.",
    creator: {
      name: "SoCubs Team",
      description:
        "Creating cute and carefree cubs on the Sei Network. Our mission is to spread joy through digital art.",
      avatar: "https://picsum.photos/200/200?random=creator1",
      website: "https://socubs.io",
      twitter: "@SoCubsNFT",
      collections: ["So Cubs", "So Bears"],
      totalNFTs: 3333,
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n6",
    name: "So Cub #4442",
    image: "https://picsum.photos/300/300?random=4",
    collection: "So Cubs",
    description: "3,333 Carefree Cubs spreading love on the Sei Network.",
    creator: {
      name: "SoCubs Team",
      description:
        "Creating cute and carefree cubs on the Sei Network. Our mission is to spread joy through digital art.",
      avatar: "https://picsum.photos/200/200?random=creator1",
      website: "https://socubs.io",
      twitter: "@SoCubsNFT",
      collections: ["So Cubs", "So Bears"],
      totalNFTs: 3333,
    },
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
    creator: {
      name: "Bored Ape Yacht Club",
      description:
        "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs—unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Available only to Bored Ape owners.",
      avatar: "https://boredapeyachtclub.com/api/jwt/ape",
      website: "https://boredapeyachtclub.com",
      twitter: "@BoredApeYC",
      collections: ["Bored Ape Yacht Club"],
      totalNFTs: 10000,
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n8",
    name: "Crypto Punk #5678",
    image: "https://picsum.photos/300/300?random=2",
    collection: "CryptoPunks",
    description: "One of 10,000 unique collectible characters",
    creator: {
      name: "CryptoPunks",
      description:
        "CryptoPunks is a collection of 10,000 unique characters. No two characters are alike, and each one of them can be officially owned by a Ethereum account.",
      avatar: "https://cryptopunks.app/cryptopunks.png",
      website: "https://cryptopunks.app",
      twitter: "@CryptoPunks",
      collections: ["CryptoPunks"],
      totalNFTs: 10000,
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6n9",
    name: "Doodle #910",
    image: "https://picsum.photos/300/300?random=3",
    collection: "Doodles",
    description: "A joyful collection of doodles",
    creator: {
      name: "Doodles",
      description:
        "Doodles is a collection of 10,000 generative art pieces created by Burnt Toast and friends. Each Doodle is unique and randomly generated from over 100 possible attributes.",
      avatar: "https://doodles.app/doodles.png",
      website: "https://doodles.app",
      twitter: "@DoodlesNFT",
      collections: ["Doodles"],
      totalNFTs: 10000,
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6na",
    name: "Azuki #1112",
    image: "https://picsum.photos/300/300?random=4",
    collection: "Azuki",
    description: "Enter the garden. A new kind of brand.",
    creator: {
      name: "Azuki",
      description:
        "Azuki is a collection of 10,000 generative art pieces created by Burnt Toast and friends. Each Azuki is unique and randomly generated from over 100 possible attributes.",
      avatar: "https://azuki.app/azuki.png",
      website: "https://azuki.app",
      twitter: "@AzukiOfficial",
      collections: ["Azuki"],
      totalNFTs: 10000,
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6nb",
    name: "Clone X #1314",
    image: "https://picsum.photos/300/300?random=5",
    collection: "Clone X",
    description: "The next generation of digital identity",
    creator: {
      name: "Clone X",
      description:
        "Clone X is a collection of 10,000 generative art pieces created by Burnt Toast and friends. Each Clone X is unique and randomly generated from over 100 possible attributes.",
      avatar: "https://clonex.app/clonex.png",
      website: "https://clonex.app",
      twitter: "@CloneXNFT",
      collections: ["Clone X"],
      totalNFTs: 10000,
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6nc",
    name: "Bored Ape #7777",
    image: "https://picsum.photos/300/300?random=6",
    collection: "Bored Ape Yacht Club",
    description: "A rare golden fur BAYC with laser eyes and crown",
    creator: {
      name: "Bored Ape Yacht Club",
      description:
        "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs—unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Available only to Bored Ape owners.",
      avatar: "https://boredapeyachtclub.com/api/jwt/ape",
      website: "https://boredapeyachtclub.com",
      twitter: "@BoredApeYC",
      collections: ["Bored Ape Yacht Club"],
      totalNFTs: 10000,
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6nd",
    name: "Bored Ape #8888",
    image: "https://picsum.photos/300/300?random=7",
    collection: "Bored Ape Yacht Club",
    description: "A zombie BAYC wearing a leather jacket and chain",
    creator: {
      name: "Bored Ape Yacht Club",
      description:
        "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs—unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Available only to Bored Ape owners.",
      avatar: "https://boredapeyachtclub.com/api/jwt/ape",
      website: "https://boredapeyachtclub.com",
      twitter: "@BoredApeYC",
      collections: ["Bored Ape Yacht Club"],
      totalNFTs: 10000,
    },
  },
  {
    id: "sei1qj2wd4p3c4qx6y5jl4vxqtmxqgvwkrzuf6ne",
    name: "Bored Ape #9999",
    image: "https://picsum.photos/300/300?random=8",
    collection: "Bored Ape Yacht Club",
    description: "A rainbow fur BAYC with 3D glasses and party hat",
    creator: {
      name: "Bored Ape Yacht Club",
      description:
        "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs—unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Available only to Bored Ape owners.",
      avatar: "https://boredapeyachtclub.com/api/jwt/ape",
      website: "https://boredapeyachtclub.com",
      twitter: "@BoredApeYC",
      collections: ["Bored Ape Yacht Club"],
      totalNFTs: 10000,
    },
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
