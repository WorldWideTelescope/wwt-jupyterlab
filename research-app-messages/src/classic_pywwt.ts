// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

/** Data structures used by older versions of the pywwt Python package.
 */

/** A command to load a WTML image collection into the frontend's registry. */
export interface LoadImageCollectionMessage {
  /** The tag identifying this message type. */
  event: "load_image_collection";

  /** The URL of the collection to load. */
  url: string;
}

// As far as I can tell, I have to implement all of these type guard functions manually :-(

/** Type guard function for LoadImageCollectionMessage. */
export function isLoadImageCollectionMessage(o: any): o is LoadImageCollectionMessage {
  return typeof o.event === "string" &&
    o.event == "load_image_collection" &&
    typeof o.url === "string";
}

/** A command to select the background imagery to show. */
export interface SetBackgroundByNameMessage {
  /** The tag identifying this message type. */
  event: "set_background_by_name";

  /** The name (partial or complete) of the imageset to use. */
  name: string;
}

/** Type guard function for SetBackgroundByNameMessage. */
export function isSetBackgroundByNameMessage(o: any): o is SetBackgroundByNameMessage {
  return typeof o.event === "string" &&
    o.event == "set_background_by_name" &&
    typeof o.name === "string";
}

export type PywwtMessage =
  LoadImageCollectionMessage |
  SetBackgroundByNameMessage;
