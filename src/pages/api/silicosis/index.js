import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      position,
      silicaDust,
      silicaDustLevel,
      workingHours,
      disease,
      workSeparation,
      firstName,
      lastName,
      riskScore,
      riskLevel,
      riskLatitude,
      riskLongitude,
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

      const { data, error } = await supabase
        .from("silicosis")
        .insert([
          {
            personal_id: personalId,
            position,
            silica_dust: silicaDust,
            silica_dust_level: silicaDustLevel,
            working_hours: workingHours,
            disease,
            work_separation: workSeparation,
            risk_score: riskScore,
            risk_level: riskLevel,
            risk_latitude: riskLatitude,
            risk_longitude: riskLongitude,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Catch Error:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("silicosis").select("*");

      if (error) {
        throw error;
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Catch Error:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
