import { forwardRef } from "react"

export type OuterLinkProps = Omit<React.ComponentPropsWithoutRef<"a">, "target" | "rel">

const OuterLink = forwardRef<HTMLAnchorElement, OuterLinkProps>(function _OuterLink(props, ref) {
  return <a ref={ref} {...props} target="_blank" rel="noopener noreferrer" />
})

export default OuterLink
