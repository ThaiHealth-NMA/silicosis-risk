import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      personalId,
      position,
      silicaDust,
      workingHours,
      workingWeeks,
      workingYears,
      ppe,
    } = req.body;

    try {
      const { error } = await supabase.from("working").insert([
        {
          personal_id: personalId,
          position: position,
          silica_dust: silicaDust,
          working_hours: workingHours,
          working_weeks: workingWeeks,
          working_years: workingYears,
          ppe: ppe,
        },
      ]);

      if (error) throw error;

      res.status(200).json({ message: "Working data inserted successfully" });
    } catch (error) {
      console.error("Error inserting working data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
