import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  const { personalId } = req.query;

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("health")
        .select("*")
        .eq("personal_id", personalId)
        .single();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const {
        bodyWeight,
        bodyHeight,
        bmi,
        medical,
        diseases,
        earSymptoms,
        earSymptomsDetails,
      } = req.body;

      const { data, error } = await supabase
        .from("health")
        .update({
          body_weight: bodyWeight,
          body_height: bodyHeight,
          bmi: bmi,
          medical: medical,
          diseases: diseases,
          ear_symptoms: earSymptoms,
          ear_symptoms_details: earSymptomsDetails,
          updated_at: new Date(),
        })
        .eq("personal_id", personalId)
        .select();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
