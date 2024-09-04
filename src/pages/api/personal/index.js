import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      idNumber,
      gender,
      firstName,
      lastName,
      phoneNumber,
      birth,
      age,
      nation,
    } = req.body;

    const missingFields = [];
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!phoneNumber) missingFields.push("phoneNumber");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    try {
      const { data: existingRecords, error: fetchError } = await supabase
        .from("personal")
        .select("id")
        .eq("first_name", firstName)
        .eq("last_name", lastName);

      if (fetchError) throw fetchError;

      if (existingRecords.length > 0) {
        return res.status(409).json({
          message:
            "Record with the same first name and last name already exists",
        });
      }

      const dataToInsert = {
        gender,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        age,
        nation,
      };

      if (idNumber) dataToInsert.id_number = idNumber;
      if (birth) dataToInsert.birth = birth;

      const { data, error } = await supabase
        .from("personal")
        .insert([dataToInsert])
        .select();

      if (error) throw error;

      const personalId = data[0]?.id;

      res.status(200).json({ personalId });
    } catch (error) {
      console.error("Error processing request:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("personal").select("*");

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching records:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
