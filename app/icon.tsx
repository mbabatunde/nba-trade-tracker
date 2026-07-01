import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Route segment config
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

// Generate the favicon from the same basketball-on-court photo used in the
// header, cropped to the ball so it reads well at small sizes.
export default function Icon() {
  const file = readFileSync(join(process.cwd(), 'public/images/basketball-court.jpg'))
  const src = `data:image/jpeg;base64,${file.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={64}
          height={64}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '72% 45%',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
