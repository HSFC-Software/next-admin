import Head from "next/head";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useSendBulkSms } from "@/lib/mutation";
import { toast } from "react-toastify";
import Layout from "@/components/layout";

export default function Wrapper() {
  return (
    <Layout activeRoute="sms">
      <Sms />
    </Layout>
  );
}

function Sms() {
  const [mobileNumbers, setMobileNumber] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const { isLoading, mutate } = useSendBulkSms();
  const [sender, setSender] = useState("HSFCTaytay");
  const [showSenderPicker, setShowSenderPicker] = useState(false);

  const handleSubmit = () => {
    const textareaEl = document.getElementById("text-content");
    const text = (textareaEl as any)?.value;

    if (!text) return;

    mutate(
      {
        text,
        receivers: mobileNumbers,
        sender,
      },
      {
        onSuccess() {
          toast.success("Message sent! 🎉", {
            autoClose: 1500,
          });
        },
        onError() {
          toast.error("Unable to send at the moment. Please try again", {
            autoClose: 1500,
          });
        },
      }
    );
  };

  const handlePress = (e: any) => {
    const value = e.target.value;
    if ((e.code === "Backspace" || e.which === 8) && value === "") {
      const _mutableMobileNumbers = [...mobileNumbers];
      _mutableMobileNumbers.pop();

      setMobileNumber(_mutableMobileNumbers);
      return;
    }

    if (
      e.code === "Enter" ||
      e.code === "Space" ||
      e.which === 13 ||
      e.which === 32
    ) {
      setMobileNumber((prev) => {
        return [...prev, value];
      });

      e.target.value = "";
    }
  };

  const handleRemoveItem = (number: string) => {
    setMobileNumber((prev) => prev.filter((item) => number !== item));
  };

  return (
    <>
      <Head>
        <title>Disciplr | SMS Text Blast</title>
        <meta name="description" content="Disciplr | Sign In" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex w-full">
        <div className="w-full">
          <div className="my-7">
            <textarea
              autoFocus
              id="text-content"
              placeholder="Text Message"
              className="w-full px-4 py-2 border-2 rounded-xl mt-2 border-gray-300 cursor"
              rows={7}
            />

            <div
              onClick={() => {
                setShowInput(true);
                document?.getElementById("mobile-input")?.focus?.();
              }}
              className="flex gap-x-1 gap-y-3 flex-wrap px-4 py-3 border-2 rounded-xl mt-2 border-gray-300 cursor text-left w-full overflow-y-auto"
            >
              {mobileNumbers.map((number) => (
                <span
                  className="bg-[#e6e6e6] pl-3 flex items-center font-medium rounded-lg"
                  key={number}
                >
                  {number}
                  <button
                    onClick={() => handleRemoveItem(number)}
                    className="px-2 text-[#FB5D64]"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
              {!showInput && mobileNumbers.length === 0 && (
                <span className="text-[#6a7380]">Recipients</span>
              )}

              <input
                maxLength={11}
                placeholder={
                  mobileNumbers.length === 0 && showInput ? "Recipients" : ""
                }
                id="mobile-input"
                className="outline-0"
                onKeyUp={handlePress}
                onFocus={() => setShowInput(true)}
                onBlur={() => {
                  if (mobileNumbers.length === 0) {
                    setShowInput(false);
                  }
                }}
              />
            </div>

            <select
              className="w-full px-4 py-2 border-2 rounded-xl mt-2 border-gray-300 cursor appearance-none"
              onChange={(e) => {
                setSender(e.target?.value);
              }}
            >
              <option value="Disciplr">Disciplr</option>
              <option selected value="HSFCTaytay">
                HSFCTaytay
              </option>
            </select>
            {/* <SelectPicker
              label="Sender Name"
              isVisible={showSenderPicker}
              value={sender}
              onConfirm={(value) => setSender(value)}
              onClose={() => setShowSenderPicker(false)}
            >
              <option value="Disciplr">Disciplr</option>
              <option value="HSFCTaytay">HSFCTaytay</option>
            </SelectPicker> */}

            {/* <input
              disabled={isLoading}
              onClick={() => setShowSenderPicker(true)}
              onFocus={() => setShowSenderPicker(false)}
              value={sender}
              readOnly
              type="text"
              placeholder="Sender Name"
              className="w-full px-4 py-2 border-2 rounded-xl mt-2 border-gray-300 cursor"
            /> */}
          </div>
          <button
            disabled={isLoading || mobileNumbers.length === 0}
            onClick={handleSubmit}
            className="bg-[#6e7ac5] disabled:opacity-50 text-white px-14 py-3 rounded-xl hover:shadow-md"
          >
            Send
          </button>
          <div />
        </div>
      </main>
    </>
  );
}
