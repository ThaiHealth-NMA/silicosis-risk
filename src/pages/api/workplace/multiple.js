import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { workplaceRecords } = req.body;

    // Log the request body for debugging
    console.log("Request body:", req.body);

    // Check if workplaceRecords is an array and log it for debugging
    if (!Array.isArray(workplaceRecords) || workplaceRecords.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          error:
            "Request body must contain a non-empty array of workplace records",
        });
    }

    // Prepare the data to insert
    const dataToInsert = [];

    for (const record of workplaceRecords) {
      const {
        firstName,
        lastName,
        workAddress,
        workLatitude,
        workLongitude,
        workSeparation,
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
          work_separation: workSeparation,
        };

        if (workAddress) data.work_address = workAddress;
        if (workLatitude) data.work_latitude = workLatitude;
        if (workLongitude) data.work_longitude = workLongitude;

        dataToInsert.push(data);
      } catch (error) {
        console.error("Error processing record:", error.message);
        return res.status(500).json({ success: false, error: error.message });
      }
    }

    // Insert all records into the database
    try {
      const { error } = await supabase.from("workplace").insert(dataToInsert);

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
