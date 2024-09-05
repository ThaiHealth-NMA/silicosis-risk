import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      homeAddress,
      homeLatitude,
      homeLongitude,
      stayYears,
      bornAddress,
    } = req.body;

    try {
      const { data: personalData, error: personalError } = await supabase
        .from("personal")
        .select("id")
        .eq("first_name", firstName)
        .eq("last_name", lastName)
        .single();

      if (!personalData) {
        return res
          .status(404)
          .json({ success: false, error: "Personal record not found" });
      }

      const personalId = personalData.id;

    const dataToInsert = {
      personal_id: personalId,
    };

    if (homeAddress) dataToInsert.home_address = homeAddress;
    if (homeLatitude) dataToInsert.home_latitude = homeLatitude;
    if (homeLongitude) dataToInsert.home_longitude = homeLongitude;
    if (stayYears) dataToInsert.stay_years = stayYears;
    if (bornAddress) dataToInsert.born_address = bornAddress;

    try {
      const { error } = await supabase.from("home").insert([dataToInsert]);

      if (error) throw error;

      res.status(200).json({ message: "Home data inserted successfully" });
    } catch (error) {
      console.error("Error inserting home data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
