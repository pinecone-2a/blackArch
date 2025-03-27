import { motion, useInView, useAnimation } from 'framer-motion'
import { useRef, useEffect, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  btn?: string
}

const Reveal: React.FC<RevealProps> = ({ children, className = 'w-fit', btn = 'w-fit' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const MainControls = useAnimation()
  const SlideControls = useAnimation()

  useEffect(() => {
    if (inView) {
      MainControls.start('visible')
      SlideControls.start('visible')
    }
  }, [inView, MainControls, SlideControls])

  return (
    <motion.div ref={ref} className={`${btn} relative overflow-hidden`}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 }
        }}
        initial='hidden'
        animate={MainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
        className={className}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: '100%' }
        }}
        initial='hidden'
        animate={SlideControls}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        className='absolute top-1 bottom-1 left-0 right-0 bg-black z-20'
      />
    </motion.div>
  )
}

export default Reveal
