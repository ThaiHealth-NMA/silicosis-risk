import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      homeAddress,
      homeLatitude,
      homeLongitude,
      stayYears,
      bornAddress,
      firstName,
      lastName,
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
        const { error: insertError } = await supabase
          .from("home")
          .insert([dataToInsert]);

        if (insertError) throw insertError;

        res.status(200).json({ message: "Home data inserted successfully" });
      } catch (insertError) {
        console.error("Error inserting home data:", insertError.message);
        res.status(500).json({ error: insertError.message });
      }
    } catch (personalError) {
      console.error("Error fetching personal data:", personalError.message);
      res.status(500).json({ error: personalError.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
