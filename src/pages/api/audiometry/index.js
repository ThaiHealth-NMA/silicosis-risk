import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      audiometry_category,
      audiometry_type,
      audiometry_result,
      ear_difference, // Optional field
      firstName,
      lastName,
    } = req.body;

    // Check for required fields
    if (
      !firstName ||
      !lastName ||
      !audiometry_category ||
      !audiometry_type ||
      !audiometry_result
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    try {
      // Fetch personal ID based on first and last name
      const { data: personalData, error: personalError } = await supabase
        .from("personal")
        .select("id")
        .eq("first_name", firstName)
        .eq("last_name", lastName)
        .single();

      if (personalError || !personalData) {
        return res
          .status(404)
          .json({ success: false, error: "Personal record not found" });
      }

      const personalId = personalData.id;

      // Insert audiometry data, including ear_difference only if it's provided
      const insertData = {
        personal_id: personalId,
        audiometry_category,
        audiometry_type,
        audiometry_result,
      };

      // Conditionally include ear_difference if it exists
      if (ear_difference !== undefined) {
        insertData.ear_difference = ear_difference;
      }

      const { data, error } = await supabase
        .from("audiometry")
        .insert([insertData])
        .select("*");

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
      const { data, error } = await supabase.from("audiometry").select("*");

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
