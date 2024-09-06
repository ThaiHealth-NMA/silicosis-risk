import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  const { method } = req;
  const { personalId } = req.query;

  if (!personalId) {
    return res.status(400).json({ message: "Missing personalId parameter" });
  }

  if (method === "GET") {
    try {
      const { data: workingData, error: workingError } = await supabase
        .from("working")
        .select("*")
        .eq("personal_id", personalId)
        .single();

      if (workingError) throw workingError;
      if (!workingData) {
        return res.status(404).json({ message: "Working data not found" });
      }

      const { data: workplaceData, error: workplaceError } = await supabase
        .from("workplace")
        .select("*")
        .eq("personal_id", personalId)
        .single();

      if (workplaceError) throw workplaceError;
      if (!workplaceData) {
        return res.status(404).json({ message: "Workplace data not found" });
      }

      const combinedData = { ...workingData, ...workplaceData };
      res.status(200).json(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else if (method === "PUT") {
    const {
      workStatus,
      position,
      noise,
      vibrateX,
      vibrateY,
      vibrateZ,
      vibrateAvg,
      vibrateTwa,
      workingHours,
      workingWeeks,
      workingYears,
      ppe,
      workAddress,
      workLatitude,
      workLongitude,
      workSeparation,
    } = req.body;

    try {
      const { data: updatedWorkingData, error: updateWorkingError } =
        await supabase
          .from("working")
          .update({
            work_status: workStatus,
            position,
            noise,
            vibrate_x: vibrateX,
            vibrate_y: vibrateY,
            vibrate_z: vibrateZ,
            vibrate_avg: vibrateAvg,
            vibrate_twa: vibrateTwa,
            working_hours: workingHours,
            working_weeks: workingWeeks,
            working_years: workingYears,
            ppe,
            updated_at: new Date(),
          })
          .eq("personal_id", personalId)
          .select();

      if (updateWorkingError) throw updateWorkingError;
      if (updatedWorkingData.length === 0) {
        return res.status(404).json({ message: "Working record not found" });
      }

      const { data: updatedWorkplaceData, error: updateWorkplaceError } =
        await supabase
          .from("workplace")
          .update({
            work_address: workAddress,
            work_latitude: workLatitude,
            work_longitude: workLongitude,
            work_separation: workSeparation,
            updated_at: new Date(),
          })
          .eq("personal_id", personalId)
          .select();

      if (updateWorkplaceError) throw updateWorkplaceError;
      if (!updatedWorkplaceData) {
        return res.status(404).json({ message: "Workplace record not found" });
      }

      res.status(200).json({ message: "Data updated successfully" });
    } catch (error) {
      console.error("Error updating data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
