import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data: workingData, error: workingError } = await supabase
        .from("working")
        .select("*");

      if (workingError) throw workingError;

      const { data: hearingLossData, error: hearingLossError } = await supabase
        .from("hearingloss")
        .select("*")
        .order("updated_at", { ascending: false });

      if (hearingLossError) throw hearingLossError;

      const latestHearingLossMap = hearingLossData.reduce((acc, record) => {
        if (
          !acc[record.personal_id] ||
          record.updated_at > acc[record.personal_id].updated_at
        ) {
          acc[record.personal_id] = record;
        }
        return acc;
      }, {});

      const combinedData = workingData
        .map((work) => {
          const hearingLossRecord = latestHearingLossMap[work.personal_id];
          return {
            noise: work.noise,
            risk_level: hearingLossRecord ? hearingLossRecord.risk_level : null,
          };
        })
        .filter((item) => item.risk_level !== null);

      res.status(200).json(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
