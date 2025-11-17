'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950">
      <section className="bg-gradient-dark py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-zinc-50 mb-6">
              About Premium
            </h1>
            <p className="text-xl text-zinc-300 leading-relaxed">
              We curate exceptional products for elevated living. Our mission is to bring you the finest selection of premium items that combine luxury with functionality.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-4xl">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-serif text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Our Story
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Founded with a passion for excellence, Premium has been dedicated to bringing you the world's finest products. We believe that quality matters, and every item in our collection is carefully selected to meet the highest standards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-serif text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Our Values
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Quality, authenticity, and exceptional service are at the heart of everything we do. We're committed to providing an unparalleled shopping experience that exceeds your expectations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
