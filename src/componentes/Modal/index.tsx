import { motion } from "framer-motion";
import Backdrop from "../Backdrop/index";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

export const Modal = ({ handleClose, text, type }: { handleClose: any, text: string, type: any }) => {
  return (
    <Backdrop onClick={handleClose}>
    {/* <Backdrop onClick={handleClose}> */}
      <motion.div
        onClick={(e) => e.stopPropagation()}  // Prevent click from closing modal
        className="modal"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ModalText text={text} />
        <ModalButton onClick={handleClose} label="Close" />
      </motion.div>

    {/* </Backdrop> */}
    </Backdrop>
  );
};

const ModalText = ({ text }: { text: string }) => (
  <div className="modal-text">
    <h3>{text}</h3>
    <h5>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius laboriosam labore, totam
      expedita voluptates tempore asperiores sequi, alias cum veritatis, minima dolor iste similique
      eos id. Porro, culpa? Officiis, placeat?
    </h5>
  </div>
);

const ModalButton = ({ onClick, label }: { onClick: any, label: any }) => (
  <motion.button
    className="modal-button"
    type="button"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {label}
  </motion.button>
);