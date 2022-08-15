import { motion } from "framer-motion"

export function Button(props: {titulo: any, onClick?: () => void, className?: string}) {
  return (
    <motion.button className={props.className} onClick={props.onClick}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} >
      {props.titulo}
    </motion.button>
  )
}