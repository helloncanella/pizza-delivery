const items = Array.from({ length: 15 }).map((e, i) => {
  return {
    id: i + "",
    name: `Item ${i}`,
    price: Number((Math.random() * 100).toFixed(2)),
    currency: "$"
  };
});

console.log(items);
