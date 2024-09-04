import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      personalId,
      workAddress,
      workLatitude,
      workLongitude,
      workSeparation,
    } = req.body;

    const dataToInsert = {
      personal_id: personalId,
      work_separation: workSeparation,
    };

    if (workAddress) dataToInsert.work_address = workAddress;
    if (workLatitude) dataToInsert.work_latitude = workLatitude;
    if (workLongitude) dataToInsert.work_longitude = workLongitude;

    try {
      const { error } = await supabase.from("workplace").insert([dataToInsert]);

      if (error) throw error;

      res.status(200).json({ message: "Workplace data inserted successfully" });
    } catch (error) {
      console.error("Error inserting workplace data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
