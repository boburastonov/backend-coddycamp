const express = require("express");
const app = express();

app.get("/cookie/login", (req, res) => {
  const token = "abc123";

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.json({
    ok: true,
    message: "httpOnly cookie qo'yildi",
    hint: "Endi /cookie/me ga kiring",
  });
});

app.get("/cookie/me", (req, res) => {
  if (req.cookies.token) {
    const token = req.cookies.token;
    // Check the token validity and perform the desired action
    res.json({
      ok: true,
      message: "Token topildi",
      token: token,
    });
  } else {
    res.status(401).json({
      ok: false,
      message: "Token topilmadi",
      hint: "Cookie yaratish uchun /cookie/login yo'nalishiga kiring",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
