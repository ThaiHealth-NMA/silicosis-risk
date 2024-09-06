import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { records } = req.body;

    // Log the request body for debugging
    console.log("Request body:", req.body);

    // Check if records is an array and is not empty
    if (!Array.isArray(records) || records.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Request body must contain a non-empty array of records",
        });
    }

    // Prepare the data to insert
    const dataToInsert = [];

    for (const record of records) {
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
      } = record;

      try {
        // Fetch the personal record to get the personalId
        const { data: personalData, error: personalError } = await supabase
          .from("personal")
          .select("id")
          .eq("first_name", firstName)
          .eq("last_name", lastName)
          .single();

        if (personalError) {
          console.error("Error fetching personal data:", personalError.message);
          return res
            .status(404)
            .json({
              success: false,
              error: `Personal record not found for ${firstName} ${lastName}`,
            });
        }

        if (!personalData) {
          return res
            .status(404)
            .json({
              success: false,
              error: `Personal record not found for ${firstName} ${lastName}`,
            });
        }

        const personalId = personalData.id;

        // Construct the data to insert
        const data = {
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
        };

        dataToInsert.push(data);
      } catch (error) {
        console.error("Error processing record:", error.message);
        return res.status(500).json({ success: false, error: error.message });
      }
    }

    // Insert all records into the database
    try {
      const { error } = await supabase.from("silicosis").insert(dataToInsert);

      if (error) throw error;

      res
        .status(200)
        .json({ success: true, message: "Records inserted successfully" });
    } catch (error) {
      console.error("Error inserting records:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("silicosis").select("*");

      if (error) throw error;

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
