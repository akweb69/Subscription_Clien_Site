import React, { useEffect, useRef, useState } from 'react'

const Sliders = () => {
    const slides = [
        "https://i.ibb.co/jvDxxkTK/image.png",
        "https://i.ibb.co/0y24wHpC/image.png",
    ]

    const [currentIndex, setCurrentIndex] = useState(0)
    const intervalRef = useRef(null)

    /* ---------- Autoplay ---------- */
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length)
        }, 4000)

        return () => clearInterval(intervalRef.current)
    }, [])

    return (
        <div className="relative w-full bg-linear-to-b from-white via-gray-50 to-white py-10">
            <div className="relative w-11/12 mx-auto overflow-hidden rounded-3xl shadow-xl">

                {/* Slides */}
                <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((src, i) => (
                        <div key={i} className="min-w-full">
                            <div className="relative aspect-[16/9] md:aspect-[16/5]">
                                <img
                                    src={src}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Sliders
