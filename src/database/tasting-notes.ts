const tastingNotes = [
  {
    name: "Floral",
    children: [
      {
        name: "Black Tea",
      },
      {
        name: "Floral",
        children: [
          { name: "Chamomile" },
          { name: "Rose" },
          { name: "Jasmine" },
        ],
      },
    ],
  },
  {
    name: "Fruity",
    children: [
      {
        name: "Berry",
        children: [
          { name: "Blackberry" },
          { name: "Raspberry" },
          { name: "Blueberry" },
          { name: "Strawberry" },
        ],
      },
      {
        name: "Dried Fruit",
        children: [{ name: "Raisin" }, { name: "Prune" }],
      },
      {
        name: "Other Fruit",
        children: [
          { name: "Coconut" },
          { name: "Cherry" },
          { name: "Pomegranate" },
          { name: "Pineapple" },
          { name: "Grape" },
          { name: "Apple" },
          { name: "Peach" },
          { name: "Pear" },
        ],
      },
      {
        name: "Citrus Fruit",
        children: [
          { name: "Grapefruit" },
          { name: "Orange" },
          { name: "Lemon" },
          { name: "Lime" },
        ],
      },
    ],
  },
  {
    name: "Sour / Fermented",
    children: [
      {
        name: "Sour",
        children: [
          { name: "Sour Aromatics" },
          { name: "Acetic Acid" },
          { name: "Butyric Acid" },
          { name: "Isovaleric Acid" },
          { name: "Citric Acid" },
          { name: "Malic Acid" },
        ],
      },
      {
        name: "Alcohol / Fermented",
        children: [
          { name: "Winey" },
          { name: "Whiskey" },
          { name: "Fermented" },
          { name: "Overripe" },
        ],
      },
    ],
  },
  {
    name: "Green / Vegetative",
    children: [
      {
        name: "Olive Oil",
      },
      {
        name: "Raw",
      },
      {
        name: "Green / Vegetative",
        children: [
          { name: "Under-ripe" },
          { name: "Peapod" },
          { name: "Fresh" },
          { name: "Dark Green" },
          { name: "Vegetative" },
          { name: "Hay-like" },
          { name: "Herb-like" },
        ],
      },
      {
        name: "Beany",
      },
    ],
  },
  {
    name: "Other",
    children: [
      {
        name: "Paper / Musty",
        children: [
          { name: "Stale" },
          { name: "Cardboard" },
          { name: "Papery" },
          { name: "Woody" },
          { name: "Moldy / Damp" },
          { name: "Musty / Dusty" },
          { name: "Musty / Earthy" },
          { name: "Animalic" },
          { name: "Meaty Brothy" },
          { name: "Phenolic" },
        ],
      },
      {
        name: "Chemical",
        children: [
          { name: "Bitter" },
          { name: "Salty" },
          { name: "Medicinal" },
          { name: "Petroleum" },
          { name: "Skunky" },
          { name: "Rubber" },
        ],
      },
    ],
  },
  {
    name: "Roasted",
    children: [
      { name: "Pipe Tobacco" },
      { name: "Tobacco" },
      {
        name: "Burnt",
        children: [
          { name: "Acrid" },
          { name: "Ashy" },
          { name: "Smoky" },
          { name: "Brown, Roast" },
        ],
      },
      {
        name: "Cereal",
        children: [{ name: "Grain" }, { name: "Malt" }],
      },
    ],
  },
  {
    name: "Spices",
    children: [
      { name: "Pungent" },
      { name: "Pepper" },
      {
        name: "Brown Spice",
        children: [
          { name: "Anise" },
          { name: "Nutmeg" },
          { name: "Cinnamon" },
          { name: "Clove" },
        ],
      },
    ],
  },
  {
    name: "Nutty / Cocoa",
    children: [
      {
        name: "Nutty",
        children: [
          { name: "Peanuts" },
          { name: "Hazelnut" },
          { name: "Almond" },
        ],
      },
      {
        name: "Cocoa",
        children: [{ name: "Chocolate" }, { name: "Dark Chocolate" }],
      },
    ],
  },
  {
    name: "Sweet",
    children: [
      {
        name: "Brown Sugar",
        children: [
          { name: "Molasses" },
          { name: "Maple Syrupe" },
          { name: "Caramelized" },
          { name: "Honey" },
        ],
      },
      { name: "Vanilla" },
      { name: "Vanillin" },
      { name: "Overall Sweet" },
      { name: "Sweet Aromatics" },
    ],
  },
];

export default tastingNotes;
