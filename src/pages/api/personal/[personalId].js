import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  const { method } = req;
  const { personalId } = req.query;

  if (!personalId) {
    return res.status(400).json({ message: "Missing personalId parameter" });
  }

  if (method === "GET") {
    try {
      const { data: personalData, error: personalError } = await supabase
        .from("personal")
        .select("*")
        .eq("id", personalId)
        .single();

      if (personalError) throw personalError;
      if (!personalData) {
        return res.status(404).json({ message: "Personal data not found" });
      }

      const { data: homeData, error: homeError } = await supabase
        .from("home")
        .select("*")
        .eq("personal_id", personalId)
        .single();

      if (homeError) throw homeError;
      if (!homeData) {
        return res.status(404).json({ message: "Home data not found" });
      }

      const combinedData = { ...personalData, ...homeData };
      res.status(200).json(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else if (method === "PUT") {
    const {
      idNumber,
      gender,
      firstName,
      lastName,
      phoneNumber,
      birth,
      age,
      nation,
      stayYears,
      homeAddress,
      homeLatitude,
      homeLongitude,
      bornAddress,
    } = req.body;

    const missingPersonalFields = [];
    if (!firstName) missingPersonalFields.push("firstName");
    if (!lastName) missingPersonalFields.push("lastName");
    if (!phoneNumber) missingPersonalFields.push("phoneNumber");
    if (missingPersonalFields.length > 0) {
      return res.status(400).json({
        message: `Missing required personal fields: ${missingPersonalFields.join(
          ", "
        )}`,
      });
    }

    try {
      const { data: updatedPersonalData, error: updatePersonalError } =
        await supabase
          .from("personal")
          .update({
            id_number: idNumber,
            gender,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            birth,
            age,
            nation,
            updated_at: new Date(),
          })
          .eq("id", personalId)
          .select();

      if (updatePersonalError) throw updatePersonalError;
      if (updatedPersonalData.length === 0) {
        return res.status(404).json({ message: "Personal record not found" });
      }

      const dataToUpdateHome = { stay_years: stayYears };

      if (homeAddress) dataToUpdateHome.home_address = homeAddress;
      if (homeLatitude) dataToUpdateHome.home_latitude = homeLatitude;
      if (homeLongitude) dataToUpdateHome.home_longitude = homeLongitude;
      if (bornAddress) dataToUpdateHome.born_address = bornAddress;

      const { data: updatedHomeData, error: updateHomeError } = await supabase
        .from("home")
        .update(dataToUpdateHome)
        .eq("personal_id", personalId);

      res.status(200).json({
        message: "Data updated successfully",
        personalData: updatedPersonalData,
        homeData: updatedHomeData,
      });
    } catch (error) {
      console.error("Error updating data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
