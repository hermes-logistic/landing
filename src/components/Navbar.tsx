'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY

      if (scrollPosition >= 100) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav
      className={`navbar navbar-expand-lg position-fixed top-0 w-100 py-0 ${scrolled ? 'scrolled' : 'initial'}`}
      id="navbar"
    >
      <div className="container-fluid">
        <div className="text-secondary navbar-brand">
          <Image src="/logo.svg" alt="Hermes Logistic" width={250} height={50} />
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggler"
          aria-controls="navbarToggler"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarToggler">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Who We Are
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Benefits
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Features
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Produtcs
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
