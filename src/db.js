const fakeDB = {
  1: { name: "Vipul" },
  2: { name: "Rahul" },
  3: { name: "Amit" },
};

export async function getFromDB(id) {
  console.log("Fetching from DB...");
  await new Promise((r) => setTimeout(r, 100));
  return fakeDB[id] || null;
}
