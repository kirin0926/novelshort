'use client';

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { HeartIcon } from "@/components/icons/HeartIcon";
import Link from "next/link";

interface NovelCardProps {
  id: string;
  cover: string;
  title: string;
  author: string;
  description: string;
  likes: number;
}

export default function NovelCard({
  id,
  cover,
  title,
  author,
  description,
  likes
}: NovelCardProps) {
  return (
    <Card 
      as={Link}
      href={`/novel/${id}`}
      className="hover:scale-105 transition-transform"
      isPressable
    >
      <CardHeader className="p-0 aspect-[3/4] relative max-h-[180px] sm:max-h-[220px]">
        <Image
          alt={title}
          className="object-cover"
          src={cover}
          removeWrapper
          classNames={{
            img: "w-full h-full object-cover"
          }}
        />
      </CardHeader>
      <CardBody className="px-2 py-1 sm:px-3 sm:py-2">
        <h4 className="font-bold text-small sm:text-large line-clamp-1">{title}</h4>
        <p className="text-tiny sm:text-small text-default-500">Author：{author}</p>
        <p className="text-tiny sm:text-small line-clamp-2 mt-1 sm:mt-2 text-default-600">
          {description}
        </p>
      </CardBody>
      <CardFooter className="gap-2 sm:gap-3 px-2 py-1 sm:px-3">
        <div className="flex gap-1 items-center">
          <HeartIcon size={16} className="text-danger" />
          <p className="text-tiny sm:text-small text-default-500">{likes}</p>
        </div>
      </CardFooter>
    </Card>
  );
} 