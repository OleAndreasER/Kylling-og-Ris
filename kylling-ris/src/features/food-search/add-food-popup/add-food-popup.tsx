import FoodInfo from "../search-results/food-info";
import styles from "./add-food-popup.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addFood } from "../../food-log/food-log-reducer";
import useOnKeyDown from "../../misc/use-on-key-down";
import addImage from "../../../assets/add.png";

import { Dialog, Transition } from "@headlessui/react";

interface AddFoodPopupProps {
  food: FoodInfo;
}

export default function AddFoodPopup({ food }: AddFoodPopupProps) {
  const [weightInputColor, setWeightInputColor] = useState<string>("black");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [weightInput, setWeightInput] = useState<string>(
    `${food.defaultWeight}`
  );
  const dispatch = useDispatch();

  function openModal() {
    setIsOpen(true);
    setWeightInputColor("black");
    setWeightInput(`${food.defaultWeight}`);
  }

  const submitFood = () => {
    const weight = Number(weightInput);
    if (isNaN(weight) || weight <= 0) {
      setWeightInputColor("red");
      return;
    }
    dispatch(addFood({ foodInfo: food, weight }));
    setIsOpen(false);
  };

  useOnKeyDown(
    () => {
      if (isOpen) {
        submitFood();
      }
    },
    ["Enter"],
    [weightInput, isOpen]
  );

  return (
    <>
      <img src={addImage} onClick={openModal} className={styles.addImage} />
      <Transition appear show={isOpen}>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <Transition.Child
            enter={styles.enter}
            enterFrom={styles.enterFrom}
            enterTo={styles.enterTo}
            leave={styles.leave}
            leaveFrom={styles.leaveFrom}
            leaveTo={styles.leaveTo}
          >
            <div className={styles.background} />
          </Transition.Child>
          <Dialog.Panel className={styles.addFoodPopup}>
            <Dialog.Title className={styles.title}>{food.name}</Dialog.Title>
            <div className={styles.bottom}>
              <div className={styles.weightInput}>
                <input
                  style={{ color: weightInputColor }}
                  autoFocus
                  value={weightInput}
                  onChange={({ target: { value: weightInput } }) =>
                    setWeightInput(weightInput)
                  }
                />
                <div>{food.weightUnit}</div>
              </div>
              <button
                onClick={() => {
                  submitFood();
                }}
              >
                Add to Log
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </>
  );
}
