// api/login.js
export default async function handler(req, res) {
  // Solo acepta solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Obtenemos la contraseña del cuerpo de la solicitud
  const { password } = req.body;
  
  // Obtenemos la contraseña correcta de la variable de entorno
  const correctPassword = process.env.PROFESSOR_PASSWORD;

  // Verificación de segurid
  if (!correctPassword) {
    console.error("Missing PROFESSOR_PASSWORD environment variable");
    return res.status(500).json({ success: false, error: 'Server misconfiguration' });
  }

  // Comparamos la contraseña.
  if (password === correctPassword) {
    // exito
    return res.status(200).json({ success: true });
  } else {
    // Fallo 401 Unauthorized
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
}
