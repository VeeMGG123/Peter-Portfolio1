document.getElementById("year").textContent = new Date().getFullYear();
const form = document.getElementById("contact-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent("طلب مشروع جديد من " + data.get("name"));
  const body = encodeURIComponent(
    "الاسم: " + data.get("name") + "\n" +
    "الإيميل: " + data.get("email") + "\n\n" +
    "تفاصيل الفكرة:\n" + data.get("message")
  );
  window.location.href = "mailto:PETER.MEDHAT@GMAIL.COM?subject=" + subject + "&body=" + body;
});
