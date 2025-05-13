// export default function StoreMap() {
//   return (
//     <section className="my-12">
//       <h2 className="text-2xl font-bold mb-4">Bản đồ cửa hàng</h2>
//       <div className="w-full h-[400px]">
//         <iframe
//           className="w-full h-full border-0"
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14936.136550276127!2d106.4371440!3d20.3889070!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDIzJzIwLjEiTiAxMDbCsDI2JzEzLjciRQ!5e0!3m2!1svi!2s!4v1715599999999"
//         ></iframe>
//       </div>
//     </section>
//   );
// }

const lat = process.env.NEXT_PUBLIC_STORE_LAT;
const lng = process.env.NEXT_PUBLIC_STORE_LNG;

const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

export default function StoreMap() {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-4">Bản đồ cửa hàng</h2>
      <div className="w-full h-[400px]">
        <iframe
          className="w-full h-full border-0"
          src={mapSrc}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
