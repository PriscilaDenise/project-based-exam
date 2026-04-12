"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export interface VoiceCommand {
  patterns: string[];
  callback: (transcript: string) => void;
}