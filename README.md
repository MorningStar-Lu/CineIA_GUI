# CineIA_CLI

Command line tool for encoding IMF IAB into DCP IAB.

![GitHub Release](https://img.shields.io/github/v/release/izwb003/CineIA_CLI)
![GitHub Last Commit](https://img.shields.io/github/last-commit/izwb003/CineIA_CLI)
![GitHub License](https://img.shields.io/github/license/izwb003/CineIA_CLI)


[简体中文](/README.CN.md)

## Introduction

CineIA is a re-encoding tool aims at creating Digital Cinema Package assets containing Immersive Audio Bitstreams that meet [IAB Application Profile 1 (SMPTE RDD57:2021)](https://doi.org/10.5594/SMPTE.RDD57.2021), to available immersive audio cinemas that support (or compatible with) this constraint (e.g. Dolby Atmos® cinemas) to play audio content with a complete immersive experience.

## Usage

### Help instructions
CineIA_CLI is a command line tool. Command line help(```cineia -h```):

```
Usage: cineia [-n] [-f] [-c <number>] [-o <number>] <input file path> <output file path> [-l] [-h]

<input file path>: Full or relative path to the IMF IAB file for conversion.
<output file path>: Full or relative path to the DCP IAB file output.


Option Summary:

-n,     --no-copy-preamble              Do not copy the "PreambleValue" part from IMF IAB bitstream.
                                        This option is for debug purpose only.
-f,     --force-dolby-constraint        Modify the bitstream to ensure that every detail conforms with Dolby's cinema constraint.
                                        Try using this argument if the output bitstream causes error,
                                        but it may cause the bitstream to not work as expected.
-c,     --set-channels <number>         Set the bed channel count in generated DCP IAB MXF's descriptor.
                                        Default: 10. Do not set unless really necessary.
-o,     --set-objects <number>          Set the object count in generated DCP IAB MXF's descriptor.
                                        Default: 118. Do not set unless really necessary.
-l,     --show-licenses                 Show open-source licenses and quit.
-h,     --help                          Print this help message and quit.
```

### Usage
This tool accepts IAB assets from Interoperable Master Format (IMF) packages as input. The input content needs to comply with [Dolby Atmos® IMF IAB Interoperability Guidelines](https://professionalsupport.dolby.com/s/article/Dolby-Atmos-IMF-IAB-interoperability-guidelines?language=en_US). Most Dolby Atmos® renderer can generate such files.

*Tip: If you have other formats of master files (such as .atmos, ADM BWF, etc.), please use the free tool [Dolby Atmos Conversion Tool](https://professional.dolby.com/product/dolby-atmos-content-creation/dolby-atmos-conversion-tool/) to convert them into IMF IAB format.*

*Tip: If the IMF IAB files you hold can cause problems, please try to add option ```-f```, or prioritize using the [Dolby Atmos Conversion Tool](https://professional.dolby.com/product/dolby-atmos-content-creation/dolby-atmos-conversion-tool/) to convert the file back to IMF IAB. The IMF IAB files created by this tool are more in line with the specification.*

After obtaining the IMF IAB ```.mxf``` file, use CineIA_CLI to convert it into DCP IAB. Run:

```sh
cineia "IMF IAB file name or path.mxf" "DCP IAB file name or path.mxf"
```

The program will automatically verify, display information, and complete the conversion.

The output DCP IAB file can be directly used by most DCP creators that support IAB/Atmos assets. Using [DCP-o-matic 2](https://dcpomatic.com/) as an example:

- Under the "Content" tab, click "Add File..." and select the DCP IAB ```.mxf``` file that you have successfully converted.
- Set "Channel" to 14 in the "Audio" tab under the "DCP" tab (may vary according to the settings of the decoder, but mostly it will be 14).
- In addition, you can also add regular stereo/5.1/7.1 audio into your DCP. They will be played when the decoder is unable to play DCP IAB, such as when it is not supported or there are errors.
- Add your other contents to build a complete DCP and render it for export.

Next, in the cinema where you need to play the content, simply load the DCP and play it according to the way you play IAB/Atmos DCPs.

## Technical Information

### Building Instructions

CineIA_CLI is a CMake project. Just follow the usage of CMake. No extra dependencies are required.

You may have to do some quick fixes to compile the project properly with the latest version of MSVC on Windows:

- Comment or delete line 34 ```#include <cvt/wstring>``` in [StringUtils.cpp](/external/iab-renderer/src/lib/commonstream/utils/StringUtils.cpp);
- Change the encoding of [stream_helper.hpp](/external/indicators/include/indicators/details/stream_helper.hpp) to UTF-8 with BOM.

*Tip: Remember to clone the git repository recursively (```git clone --recursive https://github.com/izwb003/CineIA_CLI.git```), as the repository contains submodules.*

### Why IMF IAB?
IMF IAB, defined in [ST 2067-201](https://doi.org/10.5594/SMPTE.ST2067-201.2019), is a [ST 2098-2](https://doi.org/10.5594/SMPTE.ST2098-2.2019) expansion. Except for some differences in constraints, it is consistent with DCP IAB. By directly adjusting its constraints, it can be quickly adapted into DCP IAB.

In addition, the bitstream includes a section called "Preamble" (a.k.a. "IABPCMSubFrame" in early 25CSS discussions). It contains a segment of data typically 1603 bytes (varies by frame rate) for use in bitstream decoding operation. The definition and specifications of this section is out of the scope of the [ST 2098-2](https://doi.org/10.5594/SMPTE.ST2098-2.2019) specification. Therefore, it is necessary to use the IMF IAB format to copy the Preamble generated by the IMF IAB encoder when encoding the generated DCP IAB. Otherwise, the generated DCP IAB may malfunction during playback.

*Tip: You may override this operation by using option ```-n```, but it is strongly not recommended to do so.*

## Open Source Licenses and Acknowledgements
The birth of CineIA cannot be separated from [asdcplib](https://github.com/cinecert/asdcplib) library and [iab-renderer](https://github.com/DTSProAudio/iab-renderer) library. Most of the implemention in CineIA was made by these libraries. Please ensure to refer to the open source licenses of these libraries. Run ```cineia -l``` for more information.

The progress bar, full of artistic sense, was made by MIT-licensed library [indicators](https://github.com/p-ranav/indicators).

The development and debugging of CineIA cannot be separated from [@筱理-Rize](https://space.bilibili.com/3848521/) and [@神奇的红毛丹](https://space.bilibili.com/364856318)'s encouragement and support. Also appreciate [@冷小鸢aque](https://space.bilibili.com/27063907) tirelessly contacting and assisting with in-cinema testing.

CineIA_CLI was open-sourced under [MIT License](https://opensource.org/license/mit/).

## Announcement

CineIA is an independent, open-source implementation of [IAB Application Profile 1](https://doi.org/10.5594/SMPTE.RDD57.2021). It is provided for research, testing and interoperability purposes, and is not intended for production environments and commercial use. It is not an official, certified, or vendor-provided encoder, and is not intended to replace any licensed or commercial encoder implementations, even if it produces compatible bitstreams. It may not meet the quality, robustness, performance, legal, or operational requirements expected. The output generated by this software does not represent and should not be considered as the product quality, performance, or endorsement of any company or entities. No warranty is provided, and no patent license is granted or implied. Users are responsible for ensuring compliance with any applicable laws, regulations, and patent licensing requirements when using this software.

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.**
