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


/** A command to select the background imagery to show. */
export interface SetBackgroundByNameMessage {
  /** The tag identifying this message type. */
  event: "set_background_by_name";

  /** The name (partial or complete) of the imageset to use. */
  name: string;
}

export type PywwtMessage =
  LoadImageCollectionMessage |
  SetBackgroundByNameMessage;
