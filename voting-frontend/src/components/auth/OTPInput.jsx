import { useRef } from "react";

export default function OTPInput({ value = "", onChange }) {
  const refs = useRef([...Array(6)].map(() => null));

  // 🔥 Handle single digit change
  const handleChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;

    const otpArray = value.split("");
    otpArray[index] = val;
    const newOtp = otpArray.join("");

    onChange(newOtp);

    // Auto move to next input
    if (val && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  // 🔥 Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
  };

  // 🔥 Improved paste support
  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.slice(0, 6).split("");

    const newOtp = Array(6)
      .fill("")
      .map((_, i) => digits[i] || "")
      .join("");

    onChange(newOtp);

    // focus last filled or last input
    const focusIndex = Math.min(digits.length, 5);
    refs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-11 h-12 text-center border-2 rounded-lg text-lg font-mono
                     focus:border-blue-500 focus:outline-none transition"
        />
      ))}
    </div>
  );
}