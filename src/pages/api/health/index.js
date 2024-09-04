import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      personalId,
      bodyWeight,
      bodyHeight,
      bmi,
      medical,
      diseases,
      earSymptoms,
      earSymptomsDetails,
    } = req.body;

    const dataToInsert = {
      personal_id: personalId,
      body_weight: bodyWeight,
      body_height: bodyHeight,
      bmi,
      medical,
      diseases,
      ear_symptoms: earSymptoms,
    };

    if (earSymptomsDetails)
      dataToInsert.ear_symptoms_details = earSymptomsDetails;

    try {
      const { error } = await supabase.from("health").insert([dataToInsert]);

      if (error) throw error;

      res.status(200).json({ message: "Health data inserted successfully" });
    } catch (error) {
      console.error("Error inserting health data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("health").select("*");

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching health data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
