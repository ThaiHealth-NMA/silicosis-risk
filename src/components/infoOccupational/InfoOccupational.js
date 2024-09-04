import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  Link,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import { infoList } from "./infoList";

const InfoOccupational = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        setShowScrollUp(scrollTop > 0);
        setShowScrollDown(scrollTop + clientHeight < scrollHeight);
      }
    };

    const container = listRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (item, index) => {
    setSelectedItem(item);
    if (itemRefs.current[index]) {
      itemRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    onOpen();
  };

  const scrollUp = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: -100, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: 100, behavior: "smooth" });
    }
  };

  return (
    <VStack spacing={6} align="stretch" className="h-full">
      <Box
        ref={listRef}
        className="w-full max-h-[85vh] flex flex-col gap-4 overflow-auto relative"
      >
        {infoList.map((item, index) => (
          <Box
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition-all"
            onClick={() => handleClick(item, index)}
          >
            <h1 className="mb-2 text-xl font-semibold">{item.title}</h1>
            {item.type === "Video" ? (
              <Image
                src={`https://img.youtube.com/vi/${
                  item.link.split("v=")[1]
                }/0.jpg`}
                alt={item.title}
                className="w-full h-auto max-h-96 object-cover mb-2"
                cursor="pointer"
              />
            ) : item.type === "Image" ? (
              <Image
                src={item.link}
                alt={item.title}
                className="w-full h-auto max-h-96 object-cover mb-2"
                cursor="pointer"
              />
            ) : (
              <Link
                color="blue.500"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                {item.type === "PDF" ? "คลิกเพื่ออ่าน" : ""}
              </Link>
            )}
          </Box>
        ))}

        {/* Scroll-up and Scroll-down Icons */}
        {showScrollUp && (
          <IconButton
            aria-label="Scroll up"
            icon={<AiOutlineUp />}
            position="absolute"
            top="2"
            right="0"
            zIndex="10"
            onClick={scrollUp}
            colorScheme="teal"
          />
        )}
        {showScrollDown && (
          <IconButton
            aria-label="Scroll down"
            icon={<AiOutlineDown />}
            position="absolute"
            bottom="2"
            right="0"
            zIndex="10"
            onClick={scrollDown}
            colorScheme="teal"
          />
        )}
      </Box>

      {/* Modal for Content */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedItem?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedItem?.type === "Video" && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${
                  selectedItem.link.split("v=")[1]
                }`}
                title={selectedItem.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[70vh]"
              ></iframe>
            )}
            {selectedItem?.type === "PDF" && (
              <iframe
                src={selectedItem.link}
                width="100%"
                height="600px"
                title={selectedItem.title}
                className="w-full h-[70vh]"
              ></iframe>
            )}
            {selectedItem?.type === "Image" && (
              <Image
                src={selectedItem.link}
                alt={selectedItem.title}
                className="w-full h-auto"
              />
            )}
            <div className="flex flex-col gap-2 p-4">
              <p className="text-xl overflow-auto">{selectedItem?.detail}</p>
              {selectedItem?.ref && (
                <p className="text-xs">ที่มา: {selectedItem?.ref}</p>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default InfoOccupational;
