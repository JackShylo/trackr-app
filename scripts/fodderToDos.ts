import uuid from "react-native-uuid";

export const dummy = [
      {
        id: String(uuid.v4()),
        text: "Hit level 10 on FACEIT (2000 ELO)",
        category: "gaming",
        createdAt: Date.now() - 60000,
        completed: false,
        order: 0,
      },
      {
        id: String(uuid.v4()),
        text: "Declutter bedroom wardrobe",
        category: "household",
        createdAt: Date.now() - 120000,
        completed: true,
        order: 1,
      },
      {
        id: String(uuid.v4()),
        text: "Get ears cleaned",
        category: "health",
        createdAt: Date.now() - 180000,
        completed: false,
        order: 2,
      },
      {
        id: String(uuid.v4()),
        text: "Find quality photo frame",
        category: "shopping",
        createdAt: Date.now() - 240000,
        completed: false,
        order: 3,
      },
      {
        id: String(uuid.v4()),
        text: "ind mini pc for Batocera (retro gaming)",
        category: "shopping",
        createdAt: Date.now() - 300000,
        completed: true,
        order: 4,
      },
    {
      id: String(uuid.v4()),
        text: "Repay dad ($500/$1000)",
        category: "Finance",
        createdAt: Date.now() - 300000,
        completed: true,
        order: 4,
      }
    ];  