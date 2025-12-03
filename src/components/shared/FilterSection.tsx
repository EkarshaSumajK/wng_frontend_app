import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string[];
  setSelected: (val: string[]) => void;
}

export const FilterSection = ({ title, options, selected, setSelected }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div 
        className="flex items-center justify-between mb-2 cursor-pointer group select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h4>
        <ChevronRight 
          className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
        />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 mt-2 pb-2">
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${title}-${option}`}
                    checked={selected.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelected([...selected, option]);
                      } else {
                        setSelected(selected.filter((item) => item !== option));
                      }
                    }}
                  />
                  <label
                    htmlFor={`${title}-${option}`}
                    className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 select-none"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
