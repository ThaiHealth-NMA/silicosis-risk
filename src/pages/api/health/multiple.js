import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { healthRecords } = req.body;

    // Log the request body for debugging
    console.log("Request body:", req.body);

    // Check if healthRecords is an array and log it for debugging
    if (!Array.isArray(healthRecords) || healthRecords.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must contain a non-empty array of health records",
      });
    }

    // Prepare the data to insert
    const dataToInsert = [];

    for (const record of healthRecords) {
      const {
        firstName,
        lastName,
        bodyWeight,
        bodyHeight,
        bmi,
        smoking,
        medical,
        diseases,
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
          return res.status(404).json({
            success: false,
            error: `Personal record not found for ${firstName} ${lastName}`,
          });
        }

        if (!personalData) {
          return res.status(404).json({
            success: false,
            error: `Personal record not found for ${firstName} ${lastName}`,
          });
        }

        const personalId = personalData.id;

        // Construct the data to insert
        const data = {
          personal_id: personalId,
          body_weight: bodyWeight,
          body_height: bodyHeight,
          bmi,
          smoking,
          medical,
          diseases,
        };

        dataToInsert.push(data);
      } catch (error) {
        console.error("Error processing record:", error.message);
        return res.status(500).json({ success: false, error: error.message });
      }
    }

    // Insert all records into the database
    try {
      const { error } = await supabase.from("health").insert(dataToInsert);

      if (error) throw error;

      res.status(200).json({ message: "Health data inserted successfully" });
    } catch (error) {
      console.error("Error inserting health data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
