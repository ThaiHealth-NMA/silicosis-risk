import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { home } = req.body;

    // Log the request body for debugging
    console.log("Request body:", req.body);

    // Check if home is an array and log it for debugging
    if (!Array.isArray(home)) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Request body must contain an array of home records",
        });
    }

    if (home.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Home array must not be empty" });
    }

    // Prepare the data to insert
    const dataToInsert = [];

    for (const record of home) {
      const { homes } = record;

      // Log each record for debugging
      console.log("Processing record:", record);

      if (!Array.isArray(homes)) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Each home record must contain a 'homes' array",
          });
      }

      for (const homeRecord of homes) {
        const {
          firstName,
          lastName,
          homeAddress,
          homeLatitude,
          homeLongitude,
          stayYears,
          bornAddress,
        } = homeRecord;

        try {
          // Fetch the personal record to get the personalId
          const { data: personalData, error: personalError } = await supabase
            .from("personal")
            .select("id")
            .eq("first_name", firstName)
            .eq("last_name", lastName)
            .single();

          if (personalError) {
            console.error(
              "Error fetching personal data:",
              personalError.message
            );
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
            home_address: homeAddress,
            home_latitude: homeLatitude,
            home_longitude: homeLongitude,
            stay_years: stayYears,
            born_address: bornAddress,
          };

          dataToInsert.push(data);
        } catch (error) {
          console.error("Error processing record:", error.message);
          return res.status(500).json({ success: false, error: error.message });
        }
      }
    }

    // Insert all records into the database
    try {
      const { error } = await supabase.from("home").insert(dataToInsert);

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
