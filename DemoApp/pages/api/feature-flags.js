export default function handler(req, res) {
    res.status(200).json({
      feature1: false,
      feature2: true,
    });
  }