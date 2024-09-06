import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { persons } = req.body;

    if (!Array.isArray(persons) || persons.length === 0) {
      return res.status(400).json({
        message:
          "Invalid input, 'persons' must be an array with at least one entry.",
      });
    }

    // Check if there are missing required fields (firstName, lastName)
    const missingFields = persons
      .map((person, index) => {
        const missing = [];
        if (!person.firstName) missing.push("firstName");
        // No longer requiring phoneNumber as mandatory field since it can be null
        return { index, missing };
      })
      .filter((person) => person.missing.length > 0);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields for some records",
        missingFields,
      });
    }

    try {
      const newRecords = [];
      for (const person of persons) {
        const {
          idNumber,
          firstName,
          lastName,
          gender,
          phoneNumber,
          birth,
          age,
          nation,
        } = person;

        // Check if a record with the same first and last name already exists
        const { data: existingRecords, error: fetchError } = await supabase
          .from("personal")
          .select("id")
          .eq("first_name", firstName)
          .eq("last_name", lastName);

        if (fetchError) throw fetchError;

        if (existingRecords.length > 0) {
          return res.status(409).json({
            message: `Record with the same first name (${firstName}) and last name (${lastName}) already exists`,
          });
        }

        // Prepare data for insertion, allowing null values for certain fields
        const dataToInsert = {
          gender,
          first_name: firstName,
          last_name: lastName || null, // Allow null,
          phone_number: phoneNumber || null, // Allow null
          age: age || null, // Allow null
          nation: nation || null, // Allow null
          id_number: idNumber || null, // Allow null
          birth: birth || null, // Allow null
        };

        // Insert data into the 'personal' table
        const { data, error } = await supabase
          .from("personal")
          .insert([dataToInsert])
          .select();

        if (error) throw error;

        newRecords.push(data[0]);
      }

      // Return the newly inserted records
      res.status(200).json({ newRecords });
    } catch (error) {
      console.error("Error processing request:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
