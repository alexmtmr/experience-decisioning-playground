import { ShoppingCart, Car, Plane, Factory, ShieldCheck } from "lucide-react";

/* Industry dropdown options — only Retail has data in v1 */
export const INDUSTRIES = [
  { key:"retail", label:"Retail", icon:ShoppingCart },
  { key:"automotive", label:"Automotive", icon:Car },
  { key:"travel", label:"Travel", icon:Plane },
  { key:"manufacturing", label:"B2B Mfg", icon:Factory },
  { key:"insurance", label:"Insurance", icon:ShieldCheck },
];
