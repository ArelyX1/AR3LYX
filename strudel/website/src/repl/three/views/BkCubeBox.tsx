import { useBoxControls } from '../hooks/useBoxControls'
import { CubesBox } from '../components/CubesBox'

export function BkCubesBox() {
  // Get the current panel values from Leva
  const { length, size, separation } = useBoxControls()

  return (
    <div style={{ width:'100vw', height:'100vh', position:'fixed', top:0, left:0 }}>
      {/* You should pass these values as props to your CubesBox component */}
      <CubesBox length={length} size={size} separation={separation} />
    </div>
  )
}